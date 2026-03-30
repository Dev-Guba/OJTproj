import { useEffect, useMemo, useState } from "react";
import { recordsApi } from "../../api/records.api";
import Api from "../../api/auth.api";
import Http from "../../api/Http";
import { ROLES } from "../../utils/roles";

function extractRecordRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.records)) return payload.records;
  if (Array.isArray(payload?.data?.rows)) return payload.data.rows;
  if (Array.isArray(payload?.data?.records)) return payload.data.records;
  return [];
}

function extractAdmins(payload) {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

function extractEmployees(payload) {
  if (Array.isArray(payload?.employees)) return payload.employees;
  if (Array.isArray(payload?.data?.employees)) return payload.data.employees;
  if (Array.isArray(payload)) return payload;
  return [];
}

function normalizeRecords(list) {
  return list.map((r) => ({
    ...r,
    id: r.id ?? r.record_id ?? r.recordId ?? r._id,
    article: r.article ?? "",
    propNumber: r.propNumber ?? r.prop_number ?? "",
    office: r.office ?? r.office_name ?? r.officeName ?? "Unassigned",
    areMeNo: r.areMeNo ?? r.are_me_no ?? "",
    balQty: Number(r.balQty ?? r.bal_qty ?? r.balanceQty ?? 0),
    unitValue: Number(r.unitValue ?? r.unit_value ?? 0),
    balValue: r.balValue ?? r.bal_value ?? r.balanceValue ?? "",
    createdAt: r.createdAt ?? r.created_at ?? "",
  }));
}

export default function useDashboardData(user) {
  const isSuperAdmin = user?.role_id === ROLES.SUPER_ADMIN;

  const [records, setRecords] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const requests = [
          recordsApi.getAll({
            page: 1,
            limit: 500,
            sortKey: "createdAt",
            sortDir: "desc",
          }),
        ];

        if (isSuperAdmin) {
          requests.push(Api.getAdmins());
          requests.push(Http.get("/employees"));
        } else {
          requests.push(Promise.resolve(null));
          requests.push(Http.get("/employees"));
        }

        const [recordsRes, adminsRes, employeesRes] = await Promise.all(requests);

        setRecords(normalizeRecords(extractRecordRows(recordsRes)));

        if (isSuperAdmin && adminsRes) {
          setAdmins(extractAdmins(adminsRes.data));
        } else {
          setAdmins([]);
        }

        if (employeesRes) {
          setEmployees(extractEmployees(employeesRes.data));
        } else {
          setEmployees([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isSuperAdmin]);

  const stats = useMemo(() => {
    const totalRecords = records.length;
    const totalQty = records.reduce((sum, r) => sum + Number(r.balQty || 0), 0);

    const totalValue = records.reduce((sum, r) => {
      if (r.balValue !== "" && r.balValue != null) return sum + Number(r.balValue);
      return sum + Number(r.unitValue || 0) * Number(r.balQty || 0);
    }, 0);

    const byOffice = records.reduce((acc, r) => {
      const office = String(r.office || "Unassigned").trim() || "Unassigned";
      acc[office] = (acc[office] || 0) + 1;
      return acc;
    }, {});

    const officeEntries = Object.entries(byOffice).sort((a, b) => b[1] - a[1]);
    const topOffice = officeEntries[0]?.[0] ?? "—";
    const totalOffices = officeEntries.length;
    const missingAre = records.filter((r) => !String(r.areMeNo || "").trim()).length;

    const recent = records
      .slice()
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      .slice(0, 5);

    return {
      totalRecords,
      totalQty,
      totalValue,
      topOffice,
      totalOffices,
      missingAre,
      recent,
      officeEntries,
      totalAdmins: admins.length,
      totalEmployees: employees.length,
    };
  }, [records, admins, employees]);

  return { loading, stats, isSuperAdmin };
}