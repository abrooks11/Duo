
/**
 * UI Comments: thin border, rounded corners, horizonal 
 * Elements: insurance buttons; hover = true; toggle = true
 *  
 */
const InsuranceSlector = () => {
  const insList = [
    "Aetna",
    "BC/BS", 
    "Cigna",
    "United",
    "Other",
   ]

  const generateInsList = (insurances: string[]) => {
    // map over input array and return button elements 
    const result = insurances.map((ins, index)=>{
      return (
        <button
          key={index}
        >
          {ins}
        </button>
      );
    })
    return result
  }

  const List = generateInsList(insList)

  return (
    <div className="border border-indigo-600">
      <h1>Insurance Slector</h1>
      {List}
    </div>
  )
}

export default InsuranceSlector