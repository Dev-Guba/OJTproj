import { useEffect, useMemo, useState } from "react";

import articleAPI from "../api/article.api.js";
import { recordsApi } from "../api/records.api.js";

import AssetStats from "../components/assets/AssetStats";
import AssetToolbar from "../components/assets/AssetToolbar";
import AssetTable from "../components/assets/AssetTable";
import ViewAssetModal from "../components/assets/ViewAssetModal";


const ITEMS_PER_PAGE = 10;


export default function Assets() {

  const [assets, setAssets] = useState([]);
  const [records, setRecords] = useState([]);

  const [search, setSearch] = useState("");
  const [unitFilter, setUnitFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [availablePage, setAvailablePage] = useState(1);
  const [assignedPage, setAssignedPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [loading, setLoading] = useState(false);



  const loadAssets = async () => {

    try {

      setLoading(true);


      const [
        assetRes,
        recordRes
      ] = await Promise.all([

        articleAPI.fetchArticle(),

        recordsApi.getAll()

      ]);


      setAssets(
        assetRes.data.data || []
      );


      setRecords(
        recordRes.rows || []
      );


    } catch(error){

      console.error(
        "Failed to fetch assets:",
        error
      );

    } finally {

      setLoading(false);

    }

  };



  useEffect(()=>{
    loadAssets();
  },[]);




  const issuedRecords = useMemo(()=>{

    return records.filter(
      record =>
        record.status === "ISSUED"
    );

  },[records]);





  // ASSIGNED ASSETS DATA
  const assignedAssets = useMemo(()=>{


    return issuedRecords.map(record=>({

      ArticleId:
        `${record.article_id}-${record.id}`,


      article:
        record.article,


      description:
        record.description,


      propNumber:
        record.propNumber,


      dateAcquired:
        record.dateAcquired,


      unit:
        record.unit,


      unitValue:
        record.unitValue,


      balQty:
        1,


      balValue:
        record.unitValue,


      accountableOfficer:
        record.accountableOfficer,


      owner:
        record.accountableOfficer,


      office:
        record.office,


      areMeNo:
        record.areMeNo,


      issuedDate:
        record.issuedDate,


      createdAt:
        record.createdAt,


      recordId:
        record.id

    }));


  },[issuedRecords]);







  const sortAssets = (data)=>{


    switch(sortBy){


      case "highest":

        return data.sort(
          (a,b)=>
            Number(b.balValue || 0) -
            Number(a.balValue || 0)
        );


      case "lowest":

        return data.sort(
          (a,b)=>
            Number(a.balValue || 0) -
            Number(b.balValue || 0)
        );



      case "az":

        return data.sort(
          (a,b)=>
            (a.article || "")
            .localeCompare(
              b.article || ""
            )
        );



      case "oldest":

        return data.sort(
          (a,b)=>
            new Date(a.dateAcquired) -
            new Date(b.dateAcquired)
        );



      case "newest":

      default:

        return data.sort(
          (a,b)=>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

    }

  };








  // AVAILABLE ASSETS
  const availableAssets = useMemo(()=>{


    let data = [...assets];



    if(search.trim()){

      const keyword =
        search.toLowerCase();


      data = data.filter(item=>

        item.article
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.description
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.propNumber
          ?.toLowerCase()
          .includes(keyword)

      );

    }



    if(unitFilter){

      data =
        data.filter(
          item =>
            item.unit === unitFilter
        );

    }



    return sortAssets(data);



  },[
    assets,
    search,
    unitFilter,
    sortBy
  ]);








  // ASSIGNED FILTER + SORT
  const filteredAssignedAssets = useMemo(()=>{


    let data = [...assignedAssets];



    if(search.trim()){

      const keyword =
        search.toLowerCase();


      data = data.filter(item=>

        item.article
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.description
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.propNumber
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.accountableOfficer
          ?.toLowerCase()
          .includes(keyword)

      );

    }



    if(unitFilter){

      data =
        data.filter(
          item =>
            item.unit === unitFilter
        );

    }



    return sortAssets(data);



  },[
    assignedAssets,
    search,
    unitFilter,
    sortBy
  ]);








  const paginate = (data,page)=>{

    const start =
      (page-1) * ITEMS_PER_PAGE;


    return data.slice(
      start,
      start + ITEMS_PER_PAGE
    );

  };





  const availablePaged =
    paginate(
      availableAssets,
      availablePage
    );



  const assignedPaged =
    paginate(
      filteredAssignedAssets,
      assignedPage
    );





  const totalAssets =
    availableAssets.length +
    filteredAssignedAssets.length;



  const allAssets=[
    ...availableAssets,
    ...filteredAssignedAssets
  ];



  const totalQuantity =
    allAssets.reduce(
      (sum,item)=>
        sum + Number(item.balQty || 0),
      0
    );



  const totalValue =
    allAssets.reduce(
      (sum,item)=>
        sum + Number(item.balValue || 0),
      0
    );



  const totalCategories =
    new Set(
      allAssets.map(
        item=>item.article
      )
    ).size;





  const handleView=(asset)=>{

    setSelectedAsset(asset);

    setModalOpen(true);

  };





  return (

<div className="space-y-4">


<h1 className="text-3xl font-bold">
Assets
</h1>


<AssetStats
totalAssets={totalAssets}
totalQuantity={totalQuantity}
totalValue={totalValue}
totalCategories={totalCategories}
/>



<AssetToolbar
search={search}
setSearch={setSearch}
unitFilter={unitFilter}
setUnitFilter={setUnitFilter}
sortBy={sortBy}
setSortBy={setSortBy}
/>



{
loading ?

<div className="text-center py-5">
Loading assets...
</div>

:

<>


<h2 className="font-semibold text-lg">
Available Assets
</h2>


<AssetTable
assets={availablePaged}
onView={handleView}
/>


<div className="flex gap-2 mt-3">

<button
className="px-3 py-1 border rounded"
onClick={()=>setAvailablePage(p=>Math.max(1,p-1))}
>
Prev
</button>


<span className="px-3 py-1">
Page {availablePage}
</span>


<button
className="px-3 py-1 border rounded"
onClick={()=>setAvailablePage(p=>p+1)}
>
Next
</button>

</div>





<h2 className="font-semibold text-lg mt-6">
Assigned Assets
</h2>


<AssetTable
assets={assignedPaged}
onView={handleView}
/>


<div className="flex gap-2 mt-3">

<button
className="px-3 py-1 border rounded"
onClick={()=>setAssignedPage(p=>Math.max(1,p-1))}
>
Prev
</button>


<span className="px-3 py-1">
Page {assignedPage}
</span>


<button
className="px-3 py-1 border rounded"
onClick={()=>setAssignedPage(p=>p+1)}
>
Next
</button>


</div>


</>

}




<ViewAssetModal
open={modalOpen}
asset={selectedAsset}
onClose={()=>setModalOpen(false)}
/>


</div>

  );

}