import React from 'react';
import {
    Navigate,
    unstable_Blocker as Blocker,
    useNavigate,
} from 'react-router-dom';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Form,
    json,
    Link,
    Outlet,
    Route,
    RouterProvider,
    unstable_useBlocker as useBlocker,
    useBeforeUnload,
    useLocation,
} from 'react-router-dom';

let router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route index element={<h2>Index</h2>} />
            <Route path="one" element={<h2>One</h2>} />
            <Route path="two" element={<h2>Two</h2>} />
            <Route
                path="three"
                // action={() => json({ ok: true })}
                element={
                    <>
                        <h2>Three</h2>
                        <ImportantForm />
                    </>
                }
            />
            <Route path="four" element={<h2>Four</h2>} />
        </Route>
    )
);

// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <Layout />,
//         children: [
//             {
//                 index: true,
//                 element: <h2>Index</h2>,
//             },
//             {
//                 path: 'one',
//                 element: <h2>One</h2>,
//             },
//             {
//                 path: 'two',
//                 element: <h2>Two</h2>,
//             },
//             {
//                 path: 'three',
//                 element: (
//                     <>
//                         <h2>Three</h2>
//                         <ImportantForm />
//                     </>
//                 ),
//             },
//         ],
//     },
// ]);


export default function App() {
    return <RouterProvider router={router} />;
}

function Layout() {
    let [historyIndex, setHistoryIndex] = React.useState(
        window.history.state?.idx
    );
    let location = useLocation();

    // Expose the underlying history index in the UI for debugging
    React.useEffect(() => {
        setHistoryIndex(window.history.state?.idx);
    }, [location]);

    // Give us meaningful document titles for popping back/forward more than 1 entry
    React.useEffect(() => {
        document.title = location.pathname;
    }, [location]);

    const navigate = useNavigate();

    return (
        <div style={{ border: '2px solid red' }}>
            <h1>Navigation Blocking Example</h1>
            <nav>
                <Link to="/">Index</Link>&nbsp;&nbsp;
                <Link to="/one">One</Link>&nbsp;&nbsp;
                <Link to="/two">Two</Link>&nbsp;&nbsp;
                <Link to="/three">Three (Form with blocker)</Link>&nbsp;&nbsp;
                <Link to="/four">Four (Form with prompt)</Link>&nbsp;&nbsp;
                <Link to="/five">Five</Link>&nbsp;&nbsp;
            </nav>
            <p>
                {/* Current location (index): {location.pathname} ({historyIndex}) */}
            </p>
            <button onClick={() => navigate(-1)}>go back</button>
            <button onClick={() => navigate(+1)}>go further</button>
            <Outlet />
        </div>
    );
}

export function ImportantForm() {
    let [value, setValue] = React.useState('');
    let isBlocked = value !== '';
    let blocker = useBlocker(isBlocked);
    console.log(blocker);
    // Reset the blocker if the user cleans the form
    React.useEffect(() => {
        if (blocker.state === 'blocked' && !isBlocked) {
            blocker.reset();
        }
    }, [blocker, isBlocked]);
    const message = 'are you sure?';

    useBeforeUnload(
        React.useCallback(
            (event) => {
                if (isBlocked && typeof message === 'string') {
                    event.preventDefault();
                    event.returnValue = message;
                }
            },
            [message, isBlocked]
        ),
        { capture: true }
    );

    return (
        <>
            <p>
                Is the form dirty?{' '}
                {isBlocked ? (
                    <span style={{ color: 'red' }}>Yes</span>
                ) : (
                    <span style={{ color: 'green' }}>No</span>
                )}
            </p>

            <Form method="post">
                <label>
                    Enter some important data:
                    <input
                        name="data"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </label>
                <button type="submit">Save</button>
            </Form>

            {blocker ? <ConfirmNavigation blocker={blocker} /> : null}
        </>
    );
}

function ConfirmNavigation({ blocker }: { blocker: Blocker }) {
    if (blocker.state === 'blocked') {
        return (
            <>
                <p style={{ color: 'red' }}>
                    Blocked the last navigation to {blocker.location.pathname}
                </p>
                <button onClick={() => blocker.proceed?.()}>
                    Let me through
                </button>
                <button onClick={() => blocker.reset?.()}>Keep me here</button>
            </>
        );
    }

    if (blocker.state === 'proceeding') {
        return (
            <p style={{ color: 'orange' }}>
                Proceeding through blocked navigation
            </p>
        );
    }

    return <p style={{ color: 'green' }}>Blocker is currently unblocked</p>;
}
