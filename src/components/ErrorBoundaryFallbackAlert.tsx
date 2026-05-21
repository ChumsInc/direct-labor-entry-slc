import type {FallbackProps} from "react-error-boundary";
import Alert from "react-bootstrap/Alert";

export default function ErrorBoundaryFallbackAlert({error, resetErrorBoundary}: FallbackProps) {
    return (
        <Alert variant="danger" dismissible onClose={resetErrorBoundary}>
            <strong>Something went wrong!</strong>
            <div className="text-light">
                {error instanceof Error ? error.message : "An unknown error occurred."}
            </div>
        </Alert>
    )
}
