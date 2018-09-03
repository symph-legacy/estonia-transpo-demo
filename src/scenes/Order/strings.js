import strings from "../../localisation";

export const NAV_BRAND = strings.order
export const BUTTON_GROUP = [
    {
        "text": strings.child,
        "key": "Child",
    },
    {
        "text": strings.subsidised,
        "key": "Subsidised"
    },
    {
        "text": strings.regular,
        "key": "Regular"
    },
]


// action types
export const TOGGLE_PAYMENT = "TOGGLE_PAYMENT"
export const TOGGLE_DIRECTION = "TOGGLE_DIRECTION"
export const PICK_LOCATION = "PICK_LOCATION"
export const CHANGE_MAP_CENTER = "CHANGE_MAP_CENTER"
export const CHANGE_CURRENT_LOCATION = "CHANGE_CURRENT_LOCATION"
export const CHANGE_TARGET_LOCATION = "CHANGE_TARGET_LOCATION"
export const UPDATE_SECOND_TRIP = "UPDATE_SECOND_TRIP"
export const SWITCH_TRIP = "SWITCH_TRIP"
export const NEXT_STEP = "NEXT_STEP"
export const CHANGE_DAY1 = "CHANGE_DAY1"
export const CHANGE_DAY2 = "CHANGE_DAY2"
export const CHANGE_TIME1 = "CHANGE_TIME1"
export const CHANGE_TIME2 = "CHANGE_TIME2"
export const TOGGLE_MAP_CLICK = "TOGGLE_MAP_CLICK"