import PropTypes from "prop-types";

export const employeePropShape = {
    EmployeeNumber: PropTypes.string,
    FirstName: PropTypes.string,
    LastName: PropTypes.string,
    FullName: PropTypes.string,
    Department: PropTypes.string,
    active: PropTypes.bool,
};

export const hurricaneEntryPropType = {
    id: PropTypes.number,
    EmployeeNumber: PropTypes.string,
    EntryDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    LineNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    idSteps: PropTypes.number,
    Minutes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    changed: PropTypes.bool,
};
