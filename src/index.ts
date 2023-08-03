import TaskList from "./views/TaskList"
import './styles.css'
import TaskDetails from "./views/TaskDetails";
import Login from "./views/Login";
import Auth from "./models/Auth";
import Container from "./components/Container";

import m from 'mithril'


const ROUTE_TYPES = {
    AUTH: "auth",
    PROTECTED: "protected"
}

const guard = (screen, type: string): any => {
    const component = {view: () => m(Container, m(screen))}

    return {
        onmatch: () => {
            if(type === ROUTE_TYPES.PROTECTED) {
                if(Auth.isLogged())
                    return component

                m.route.set('/login')
            } else if(type === ROUTE_TYPES.AUTH) {
                if(!Auth.isLogged())
                    return component

                m.route.set('/')
            }

            m.route.SKIP
        }
    }
}

m.route(document.body, "/", {
    "/task/:id": guard(TaskDetails, ROUTE_TYPES.AUTH),
    "/login": guard(Login, ROUTE_TYPES.AUTH),
    "/": guard(TaskList, ROUTE_TYPES.PROTECTED)
})