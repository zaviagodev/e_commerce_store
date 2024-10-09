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
              message={message}
              description={description}
              cancelMutation={cancelMutation}
            />
          ),
          type: "default",
        });
      } else {
        toast(
          <UndoableNotification
            message={message}
            description={description}
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
          render: (
            <UndoableNotification message={message} description={description} />
          ),
          closeButton: true,
          autoClose: 5000,
          type,
        });
      } else {
        toast(
          <UndoableNotification message={message} description={description} />,
          {
            toastId: key,
            type,
          }
        );
      }
    }
  },
  close: (key) => toast.dismiss(key),
};
