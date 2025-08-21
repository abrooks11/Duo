interface Props {
  dropDownList: {[key: string]: string};
  value: string;
  onChange: (newValue: string) => void;
}

const DropDown = ({ dropDownList, value, onChange }:Props) => {   
  return (
    <select
      // name="reason"
      // id="reason"
      value={value || 'Pending'} 
      onChange={(e) => {
        console.log('Dropdown value changing to:', e.target.value); // Add this debug log
        onChange(e.target.value);
      }}
    >
      {dropDownList && Object.entries(dropDownList).map(([key, displayName])=> {
        // console.log(displayName);
       return  <option key={key} value={key}>{displayName}</option>
      }) 
      }
    </select>
  );
};

export default DropDown;
