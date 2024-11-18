import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { rem } from "@mantine/core";

export function showLoadingNotification(message: string) {
  return notifications.show({
    loading: true,
    title: "Just a moment",
    message,
    autoClose: false,
    withCloseButton: false,
    withBorder: true,
    px: "lg",
  });
}

export function updateNotificationAsError(id: string, message: string) {
  notifications.update({
    id,
    loading: false,
    autoClose: 5000, // show errors for 5 seconds
    withCloseButton: true,
    closeButtonProps: { "aria-label": "Hide notification" },
    color: "red",
    title: "Oh no!",
    message,
    icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
  });
}

export function updateNotificationAsSuccess(id: string, message: string) {
  notifications.update({
    id,
    loading: false,
    autoClose: 2000, // show success for 2 seconds
    withCloseButton: true,
    closeButtonProps: { "aria-label": "Hide notification" },
    color: "teal",
    title: "Success!",
    message,
    icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
  });
}
