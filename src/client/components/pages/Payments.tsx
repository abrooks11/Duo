/**
 * What do I do with payments 
 * 
 * 
 * - upload payments received from bank: {
 * postDate:
 * description: pull insurance name and reference number 
 * -- name: (first element, split after HCCLAIMPM or Novitas) otherwise don't add
 * -- reference: (last * and right til not number)
 * credit:
 * }
 * 
 * - iterate over bank payments
 * --if the ID matches, toggle tebra payment 
 */
const Payments = () => {
    /**
     * STATE: array of objects
     */
  return (
    <div>Payments</div>
  )
}

export default Payments
