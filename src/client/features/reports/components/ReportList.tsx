import { useState } from "react"
import { sampleReportList } from "./sampledata"
import ReportListItem from "./ReportListItem"

const ReportList = () => {
const [reportList, setReportList] = useState(sampleReportList)

const reportItems = reportList.map(report => <div>{report.title}</div>)

  return (
    <div>
        <div>Side Bar Title</div>
            {reportItems}
    </div>

  )
}

export default ReportList