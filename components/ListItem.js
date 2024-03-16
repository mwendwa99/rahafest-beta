import * as React from "react";
import { TouchableOpacity, Tou } from "react-native";
import { List, Divider } from "react-native-paper";

const ListItem = ({
  title,
  description,
  iconLeft,
  iconRight,
  disabledLeft,
  disabledRight,
  iconStyle,
  handlePressLeftIcon,
  handlePressRightIcon,
  handlePressLink,
}) => {
  return (
    <List.Section style={{ color: "#fff" }} titleStyle={{ color: "#fff" }}>
      <List.Item
        onPress={handlePressLink}
        titleStyle={{ color: "#fff" }}
        title={title}
        description={description}
        left={(iconProps) =>
          iconLeft && (
            <TouchableOpacity
              disabled={disabledRight}
              onPress={handlePressLeftIcon}
            >
              <List.Icon
                {...iconProps}
                icon={iconLeft}
                color="#fff"
                style={iconStyle}
              />
            </TouchableOpacity>
          )
        }
        right={(iconProps) =>
          iconRight && (
            <TouchableOpacity
              disabled={disabledLeft}
              onPress={handlePressRightIcon}
            >
              <List.Icon
                {...iconProps}
                icon={iconRight}
                color="#fff"
                style={iconStyle}
              />
            </TouchableOpacity>
          )
        }
      />
      <Divider />
    </List.Section>
  );
};

export default ListItem;
