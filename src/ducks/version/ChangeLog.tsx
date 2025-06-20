import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectChangeLog, selectLoadingChangeLog} from "./index";
import ProgressBar from "react-bootstrap/ProgressBar";
import {loadChangeLog} from "./actions";
import VersionNo from "./VersionNo";
import styled from "@emotion/styled";

const ChangeLogContainer = styled.div`
    .card-body {
        background-color: var(--bs-dark-bg-subtle);
        //padding: 0.5rem;
    }        
    code {
        font-family: Roboto Mono, monospace;
        white-space: pre-wrap;
        color: var(--bs-success-text-emphasis);
        font-size: 0.75rem;
    }
`;

const removeLinks = (text: string) => {
    return text.replace(/\(https\S+\)/gm, '')
}
const ChangeLog = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectLoadingChangeLog);
    const changeLog = useAppSelector(selectChangeLog);

    const [parsed, setParsed] = React.useState<string>(removeLinks(changeLog ?? ''));

    useEffect(() => {
        if (!changeLog) {
            dispatch(loadChangeLog())
        }
        setParsed(removeLinks(changeLog ?? ''));
    }, [changeLog]);

    return (
        <div className="row g-3 justify-content-md-center">
            <div className="col-12 col-md-6">
                <ChangeLogContainer>
                    <div className="card ">
                        <h2 className="card-header"><VersionNo/></h2>
                        <div className="card-body">
                            <div className="card-text">
                                {loading && <ProgressBar animated striped now={100}/>}
                                <code>{parsed}</code>
                            </div>
                        </div>
                    </div>
                </ChangeLogContainer>
            </div>
        </div>
    )
}

export default ChangeLog;
