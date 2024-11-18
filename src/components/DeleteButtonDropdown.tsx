import { ActionIcon, Menu } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

interface DeleteButtonDropdownProps {
  onClickDelete: () => void;
  type: string;
}

const DeleteButtonDropdown = ({
  onClickDelete,
  type,
}: DeleteButtonDropdownProps) => {
  return (
    <Menu.Dropdown
      bg={"none"}
      style={{
        border: "none",
      }}
    >
      <Menu.Item
        aria-label="Delete this instruction"
        styles={{
          item: {
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <ActionIcon
          // line below needed since both Menu.Item and ActionIcon renders a button (a button in a button is not valid HTML )
          component="div"
          onClick={onClickDelete}
          variant="filled"
          aria-label={`Delete ${type}`}
          size={"lg"}
        >
          <IconTrash size={20} stroke={1.5} />
        </ActionIcon>
      </Menu.Item>
    </Menu.Dropdown>
  );
};

export default DeleteButtonDropdown;
