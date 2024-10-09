type UndoableNotification = {
  message: string;
  description?: string;
  cancelMutation?: () => void;
  closeToast?: () => void;
};

export const UndoableNotification: React.FC<UndoableNotification> = ({
  closeToast,
  cancelMutation,
  message,
  description,
}) => {
  return (
    <div>
      <p
        className="text-lg"
        dangerouslySetInnerHTML={{
          __html: message,
        }}
      />
      {description && (
        <p
          className="text-sm text-gray-500"
          dangerouslySetInnerHTML={{ __html: description ?? "" }}
        />
      )}
      {cancelMutation && (
        <button
          onClick={() => {
            cancelMutation?.();
            closeToast?.();
          }}
        >
          Undo
        </button>
      )}
    </div>
  );
};
