import React, { useEffect, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
Axios.defaults.baseURL = process.env.BACKENDURL || "";
import { CSSTransition } from "react-transition-group";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

//Components
import Header from "./components/Header";
const HomeGuest = React.lazy(() => import("./components/HomeGuest"));
const Home = React.lazy(() => import("./components/Home"));
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
import FlashMessages from "./components/FlashMessages";
const Profile = React.lazy(() => import("./components/Profile"));
const EditPost = React.lazy(() => import("./components/EditPost"));
import NotFound from "./components/NotFound";
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));
import LoadingDotsIcon from "./components/LoadingDotsIcon";

const Main = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("socialAppToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("socialAppToken"),
      username: localStorage.getItem("socialAppUsername"),
      avatar: localStorage.getItem("socialAppAvatar"),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        break;
      case "logout":
        draft.loggedIn = false;
        break;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        break;
      case "openSearch":
        draft.isSearchOpen = true;
        break;
      case "closeSearch":
        draft.isSearchOpen = false;
        break;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        break;
      case "closeChat":
        draft.isChatOpen = false;
        break;
      case "incrementUnreadChatCount":
        draft.unreadChatCount++;
        break;
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("socialAppToken", state.user.token);
      localStorage.setItem("socialAppUsername", state.user.username);
      localStorage.setItem("socialAppAvatar", state.user.avatar);
    } else {
      localStorage.clear();
    }
  }, [state.loggedIn]);

  useEffect(() => {
    if (state.loggedIn) {
      const controller = new AbortController();
      const signal = controller.signal;
      async function fetchResults() {
        try {
          const response = await Axios.post("/checkToken", { token: state.user.token }, { signal });
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({ type: "flashMessage", value: "Your session has expired. Please log in again." });
          }
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
        }
      }
      fetchResults();
      return () => controller.abort();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Routes>
              <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
              <Route path="/profile/:username/*" element={<Profile />} />
              <Route path="/post/:id" element={<ViewSinglePost />} />
              <Route path="/post/:id/edit" element={<EditPost />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(
  // <React.StrictMode>
  <Main />
  // </React.StrictMode>
);

if (module.hot) {
  module.hot.accept();
}
