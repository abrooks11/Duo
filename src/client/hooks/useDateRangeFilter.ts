import {useMemo} from 'react'
import useGlobalContext from './useGlobalContext'

const useDateRangeFilter = (data: any[], dateKey: string) => {

    const {state} = useGlobalContext()
    const {startDate, endDate} = state.selectedDateRange[0]
    
    // Convert to Date objects
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null

    // dataArr.forEach(item => console.log(new Date(item[dateKey])))

    // console.log(data[0])
    // console.log(new Date(startDate))

// Create a function to strip time from dates
const stripTime = (date: Date | null): Date | null => {
    if (!date) return null
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// Strip time components
const startDateStripped = stripTime(start)
const endDateStripped = stripTime(end)

const filteredData = useMemo(() => {
    // If no dates are selected, return all data
    if (!startDateStripped && !endDateStripped) return data

    // Check if it's a single-day selection
    const isSingleDaySelection = startDateStripped && 
        endDateStripped && 
        startDateStripped.getTime() === endDateStripped.getTime()

    return data.filter(item => {
        // Convert item date and strip time
        const itemDate = new Date(item[dateKey])
        const itemDateStripped = stripTime(itemDate)
        
        if (!itemDateStripped) return false // Skip invalid dates
        
        // For single-day selection
        if (isSingleDaySelection) {
            return itemDateStripped.getTime() === startDateStripped!.getTime()
        }
        
        // For date range
        const afterStart = !startDateStripped || 
            itemDateStripped.getTime() >= startDateStripped.getTime()
        const beforeEnd = !endDateStripped || 
            itemDateStripped.getTime() <= endDateStripped.getTime()
        
        return afterStart && beforeEnd
    })
}, [data, dateKey, startDate, endDate])

return filteredData
}
export default useDateRangeFilter