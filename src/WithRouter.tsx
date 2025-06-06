import { NavigateFunction, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Location as HLocation } from 'history';
import {ComponentType, FC} from "react";
import { Params } from "react-router";

export interface WithRouter {
  router: {
    location: HLocation,
    navigate: NavigateFunction,
    params: Readonly<Params<string>>,
  }
}

export function withRouter<T extends WithRouter>(C: ComponentType<T>): FC<Omit<T, keyof WithRouter>> {
  function ComponentWithRouterProp(props: object) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return (
        <C
            {...props as T}
            router={{ location, navigate, params }}
        />
    );
  }

  return ComponentWithRouterProp;
}
