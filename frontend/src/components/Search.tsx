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
			console.log({
				debounceQuery,
				data,
			});
			if (debounceQuery.trim()) {
				try {
					const {message, body} = await filterData(encodeURIComponent(debounceQuery.trim()));
					toast.success(message);
					setData(body);
				} catch (err: any) {
          toast.error(err.message);
        }
			}else{
				setData(initialData);
			}
		};
		fiterDataTrigger();
		//eslint-disable-next-line
	}, [debounceQuery]);
	return (
		<div>
			<Toaster />
			<h4>Search</h4>
			<form>
				<input
					type="search"
					placeholder="Search..."
					value={query}
					onChange={onInputChange}
				/>
			</form>
			<ul>
				{data.map((item) => (
					<li key={`${item.Name}`}>
						<article>
							{Object.entries(item).map(([key, value]) => (<p key={`${key}`}><strong>{key}: </strong>{value}</p>))}
						</article>
					</li>
				))}
			</ul>
		</div>
	);
};
