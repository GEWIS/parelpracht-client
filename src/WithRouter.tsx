import * as React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Location as HLocation } from 'history';
import { NavigateFunction } from 'react-router/dist/lib/hooks';

export interface WithRouter {
  router: {
    location: HLocation,
    navigate: NavigateFunction,
    params: Readonly<any>,
  }
}

// export function withRouter<ComponentProps>(Component: React.ComponentType<ComponentProps>) {
//   function ComponentWithRouterProp(props: ComponentProps) {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const params = useParams();
//
//     return <Component {...props} router={{ location, navigate, params }} />;
//   }
//
//   return ComponentWithRouterProp;
// }

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
        <Component
            {...props}
            router={{ location, navigate, params }}
        />
    );
  }

  return ComponentWithRouterProp;
}