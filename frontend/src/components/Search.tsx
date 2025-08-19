import {useEffect, useState, type ChangeEvent} from "react";
import {filterData} from "../services/filterData";
import {toast, Toaster} from "sonner";
import { useDebounce } from "@uidotdev/usehooks";

interface SearchProps {
	initialData: Array<Record<string, string>>;
}
export const Search = ({initialData}: SearchProps) => {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q") || "";
	const [data, setData] = useState<Array<Record<string, string>>>(() => {
    return q ? [] : initialData;
  });
	const [query, setQuery] = useState<string>(q);
  const debounceQuery = useDebounce(query, 300);
  
	const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
		setQuery((e.target as HTMLInputElement).value);
	};

	useEffect(() => {
		window.history.replaceState({}, "", `?q=${encodeURIComponent(debounceQuery)}`);
		const fiterDataTrigger = async () => {
			if (debounceQuery) {
				try {
					const {message, body} = await filterData(debounceQuery);
					toast.success(message);
					setData(body);
				} catch (err: any) {
          toast.error(err.message);
        }
			}
		};
		fiterDataTrigger();
	}, [debounceQuery]);
	return (
		<div>
			<Toaster />
			<h4>Search</h4>
			<input
				type="search"
				placeholder="Search..."
				value={query}
				onChange={onInputChange}
			/>
			<ul>
				{data.map((item, index) => (
					<li key={index}>{JSON.stringify(item)}</li>
				))}
			</ul>
		</div>
	);
};
