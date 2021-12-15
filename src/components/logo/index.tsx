import { AppRoute, AppInfo } from "../../data/enum";
import React, { ReactElement } from "react";
import LogoSVG from './assets/logo.svg';

import { Link } from "react-router-dom";

interface LogoProps {
    width: number,
    height: number
}

export default function Logo({ width, height }: LogoProps): ReactElement {
    return (
        <Link to={AppRoute.Home}>
            <LogoSVG
                aria-label={`Logotype of ${AppInfo.Name}`}
                role='img'
                width={width}
                height={height}
            />
        </Link>
    );
}
