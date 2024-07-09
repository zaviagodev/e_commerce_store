import React from "react";
import { NotificationProvider } from "@refinedev/core";
import { toast } from "react-toastify";
import { UndoableNotification } from "../components/toast/undoableNotification";

export const notificationProvider: NotificationProvider = {
  open: ({
    key,
    message,
    description,
    type,
    undoableTimeout,
    cancelMutation,
  }) => {
    if (type === "progress") {
      if (toast.isActive(key as React.ReactText)) {
        toast.update(key as React.ReactText, {
          progress: undoableTimeout && (undoableTimeout / 10) * 2,
          render: (
            <UndoableNotification
              message={description ?? message}
              cancelMutation={cancelMutation}
            />
          ),
          type: "default",
        });
      } else {
        toast(
          <UndoableNotification
            message={description ?? message}
            cancelMutation={cancelMutation}
          />,
          {
            toastId: key,
            updateId: key,
            closeOnClick: false,
            closeButton: false,
            autoClose: false,
            progress: undoableTimeout && (undoableTimeout / 10) * 2,
          }
        );
      }
    } else {
      if (toast.isActive(key as React.ReactText)) {
        toast.update(key as React.ReactText, {
          render: description ?? message,
          closeButton: true,
          autoClose: 5000,
          type,
        });
      } else {
        toast(description ?? message, {
          toastId: key,
          type,
        });
      }
    }
  },
  close: (key) => toast.dismiss(key),
};
