import {useEffect} from "react";

interface UseSeoProps {
	title: string;
	description: string;
}
export const useSEO = ({title, description}: UseSeoProps) => {
	useEffect(() => {
		document.title = title;
		document
			.querySelector("meta[name='description']")
			?.setAttribute("content", description);
	}, [title, description]);
};
