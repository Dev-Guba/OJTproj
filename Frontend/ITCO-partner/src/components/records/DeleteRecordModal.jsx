import Modal from "../ui/Modal";

export default function DeleteRecordModal({
  open,
  onClose,
  onConfirm,
}) {
  return (
    <Modal
      open={open}
      title="Remove this item?"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText="Remove"
    >
      This action will permanently remove the record from storage.
    </Modal>
  );
}