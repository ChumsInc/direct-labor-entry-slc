import React from "react";
import AnalysisFilters from "./AnalysisFilters";
import AnalysisReport from "./AnalysisReport";


const AnalysisTab: React.FC = () => {

    return (
        <div>
            <AnalysisFilters/>
            <div className="mt-4">
                <AnalysisReport/>
            </div>
        </div>
    )
}

export default AnalysisTab;
