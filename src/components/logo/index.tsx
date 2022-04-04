import { AppRoute, AppInfo } from "../../data/enum";
import { Link } from "react-router-dom";

interface LogoProps {
	width: number;
	height: number;
}

export default function Logo({ width, height }: LogoProps) {
	return (
		<Link to={AppRoute.Home}>
			<img
				src={AppInfo.LogoPath}
				alt={AppInfo.Name}
				width={width}
				height={height}
			/>
		</Link>
	);
}
