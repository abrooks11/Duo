import {useState} from 'react'

interface Props {
  dropDownList: {[key: string]: string};
  value: string;
}

const DropDown = ({ dropDownList, value }:Props) => {
  const [dropDown, setDropDwon] = useState(value)
  const handleDropDownChange = (val) => {
    setDropDwon(val)
  }
  // console.log({dropDownList});
  
  return (
    <select
      // name="reason"
      // id="reason"
      value={dropDown || 'Pending'} 
      onChange={(e) => handleDropDownChange(e.target.value)}
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
