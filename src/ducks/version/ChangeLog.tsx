import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectChangeLog, selectLoadingChangeLog} from "./selectors";
import ProgressBar from "react-bootstrap/ProgressBar";
import {loadChangeLog} from "./actions";
import VersionNo from "./VersionNo";

const ChangeLog = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectLoadingChangeLog);
    const changeLog = useAppSelector(selectChangeLog);

    useEffect(() => {
        dispatch(loadChangeLog())
    }, []);

    return (
        <div className="row g-3 justify-content-md-center">
            <div className="col-12 col-md-6">
                <div className="card ">
                    <h1 className="card-header"><VersionNo/></h1>
                    <div className="card-body">
                        <div className="card-text">
                            {loading && <ProgressBar animated striped now={100}/>}
                            <div className="font-monospace">
                                <pre style={{whiteSpace: 'pre-wrap'}}>{changeLog}</pre>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ChangeLog;
