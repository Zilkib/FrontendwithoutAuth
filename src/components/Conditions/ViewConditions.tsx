import React, { useState, useEffect } from 'react';
import { fhirR4 } from '@smile-cdr/fhirts';
import BundleEntry from '../Utils/BundleEntry';
//import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { filterResources, sortResources } from '../Utils/utils';
import Banner from '../elements/Banner';

const ConditionList: React.FC = () => {
	// State variables
	//const { getAccessTokenSilently } = useAuth0();
	const token = "";
	const [conditions, setConditions] = useState<fhirR4.Condition[]>([]);
	const [searchText, setSearchText] = useState('');
	const [filterAttribute, setFilterAttribute] = useState('code');
	const [sortAttribute, setSortAttribute] = useState('recordedDate');
	const [conditionsPerPage, setConditionsPerPage] = useState(20);
	const [offsetConditionsPerPage, setOffsetConditionsPerPage] = useState(0);
	const [patientData, setPatientData] = useState<fhirR4.Patient[]>([]);
	const navigate = useNavigate();

	// Fetch conditions when the component mounts
	useEffect(() => {
		fetchConditions();
	}, [conditionsPerPage, offsetConditionsPerPage, token]);

	/**
	 * Fetches condition data from the FHIR server.
	 *
	 * This function asynchronously retrieves a list of conditions from the FHIR server
	 * using the GET method. The function then extracts the resource property from each
	 * Bundle entry in the response data and updates the component's state with the extracted
	 * conditions data.
	 *
	 * If there is no 'entry' key in the response data, it means that the limit of the fetched
	 * conditions has been reached, and a warning should be issued. Any encountered errors during
	 * fetching are logged in the console.
	 *
	 * @async
	 * @function
	 */
	const fetchConditions = async () => {
		const token = "" ; /*await getAccessTokenSilently();*/
		try {
			const response = await fetch(
				`http://localhost:8080/fhir/Condition?_count=${conditionsPerPage}&_offset=${offsetConditionsPerPage}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			); // Replace with your API endpoint
			const data = await response.json();

			// Extract the resource property from the Bundle entry

			if ('entry' in data) {
				const conditionsData = data.entry.map(
					(entry: BundleEntry) => entry.resource
				);

				// get patient data from each condition database
				const patientPromises = await conditionsData.map(
					(condition: fhirR4.Condition) =>
						fetch(
							`http://localhost:8080/fhir/Patient/${condition.subject?.identifier?.value}`
						)
				);

				const patientResponses = await Promise.all(patientPromises);

				const patientData = await Promise.all(
					patientResponses.map(response => response.json())
				);

				// Store the extracted patient data in state
				setPatientData(patientData as fhirR4.Patient[]);

				// Store the extracted conditions in state
				setConditions(conditionsData as fhirR4.Condition[]);
			} else {
				//TODO : What should happen if we have reached the limit. Some warning?
			}
		} catch (error) {
			console.error('Error fetching conditions:', error);
		}
	};

	/**
	 * Filters and sorts condition data based on selected attributes.
	 *
	 * This function filters the condition data based on the selected filter attribute and
	 * search text. The filtered condition data is then sorted based on the selected sort
	 * attribute. The function uses helper functions filterResources and sortResources for
	 * filtering and sorting respectively.
	 *
	 * @function
	 * @returns {Array} An array of sorted and filtered condition data.
	 */
	const filterAndSortConditions = () => {
		const filteredConditions = filterResources(
			conditions,
			filterAttribute,
			searchText
		);
		const sortedConditions = filteredConditions.sort((a, b) => {
			// Sort by code
			if (sortAttribute === 'code') {
				return (
					(a?.code?.coding?.[0]?.code ?? '').localeCompare(
						b?.code?.coding?.[0]?.code ?? ''
					) ?? 0
				);
			}
			// Sort by patient ID
			else if (sortAttribute === 'patientId') {
				return (
					(a?.subject?.identifier?.value ?? '').localeCompare(
						b?.subject?.identifier?.value ?? ''
					) ?? 0
				);
			}
			// Sort by clinical status
			else if (sortAttribute === 'clinicalStatus') {
				return (
					(a?.clinicalStatus?.coding?.[0]?.display ?? '').localeCompare(
						b?.clinicalStatus?.coding?.[0]?.display ?? ''
					) ?? 0
				);
			}
			// Add more conditions for additional sorting attributes
			else {
				return 0; // No sorting
			}
		});
		return sortedConditions;
	};

	/**
	 * Updates the search text state when search input changes.
	 *
	 * @function
	 * @param {React.ChangeEvent<HTMLInputElement>} event - The change event of the search input field.
	 */
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(event.target.value);
	};

	/**
	 * Updates the filter attribute state when the filter attribute selection changes.
	 *
	 * @function
	 * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event of the filter attribute selection field.
	 */
	const handleFilterAttributeChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setFilterAttribute(event.target.value);
	};

	/**
	 * Updates the sort attribute state when the sort attribute selection changes.
	 *
	 * @function
	 * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event of the sort attribute selection field.
	 */
	const handleSortAttributeChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setSortAttribute(event.target.value);
	};

	/**
	 * Refreshes the condition data by fetching conditions again.
	 *
	 * @function
	 */
	const handleRefresh = () => {
		fetchConditions(); // Fetch conditions again to refresh the data
	};

	/**
	 * Navigates to the condition detail page with the conditionId as a parameter.
	 *
	 * @function
	 * @param {string | undefined} conditionId - The id of the condition to navigate to its detail page.
	 */
	const handleRowClick = (conditionId: string | undefined) => {
		if (conditionId) {
			// Navigate to the condition detail page with the conditionId as a parameter
			navigate(`/condition/${conditionId}`);
		}
	};

	/**
	 * Handles changes to the number of conditions to display per page.
	 *
	 * @function
	 * @param {string} value - The desired number of conditions to display per page as a string.
	 */
	const handleConditionsPerPageChange = (value: string) => {
		const parsedValue = parseInt(value, 10);
		setConditionsPerPage(parsedValue);
	};
	/**
	 * Handles changes to the offset of conditions to display per page.
	 * If a negative offset value is received, it's reset to zero.
	 *
	 * @function
	 * @param {number} value - The desired offset of conditions to display per page.
	 */
	const handleOffsetConditionsPerPageChange = (value: number) => {
		if (value < 0) {
			value = 0;
		}
		setOffsetConditionsPerPage(value);
	};

	return (
		<div>
			<Banner>What are you looking for?</Banner>
			<div>
				<div className="flex flex-wrap items-center mb-4 font-mono md:font-mono text-lg/5 md:text-lg/5 justify-center">
					<select
						className="rounded border-b-2 mr-2 font-mono md:font-mono text-lg/5 md:text-lg/5 mb-2 md:mb-0"
						value={filterAttribute}
						onChange={handleFilterAttributeChange}
					>
						<option value="code">Search by Condition Code</option>
						<option value="patientId">Search by Patient ID</option>
						<option value="clinicalStatus"> Search by Clinical Status</option>
					</select>
					<select
						className="rounded border-b-2 mr-2 font-mono md:font-mono text-lg/5 md:text-lg/5 mb-2 md:mb-0"
						value={sortAttribute}
						onChange={handleSortAttributeChange}
					>
						{/* sort data by code, patientid and clinical status */}
						<option value="code">Sort by Condition Code</option>
						<option value="patientId">Sort by Patient ID</option>
						{/* <option value="clinicalStatus"> Sort by Clinical Status</option> */}
					</select>
					<input
						className="rounded border-b-2 mr-2"
						type="text"
						value={searchText}
						onChange={handleSearch}
						placeholder="Search"
					/>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={handleRefresh}
					>
						Refresh
					</button>
				</div>

				<div className="flex flex-wrap items-center mb-4 font-mono md:font-mono text-lg/5 md:text-lg/5 justify-center">
					<div className="ml-4">
						<label htmlFor="numberSelect">Conditions per Page:</label>
						<select
							id="numberSelect"
							onChange={e => handleConditionsPerPageChange(e.target.value)}
							defaultValue={'20'}
						>
							<option value="">Select a number</option>
							<option value="20">20</option>
							<option value="30">30</option>
							<option value="40">40</option>
							<option value="50">50</option>
							{/* Add more options if needed */}
						</select>
					</div>

					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
						onClick={() =>
							handleOffsetConditionsPerPageChange(
								offsetConditionsPerPage - conditionsPerPage
							)
						}
					>
						Prev {conditionsPerPage} Conditions
					</button>

					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
						onClick={() =>
							handleOffsetConditionsPerPageChange(
								offsetConditionsPerPage + conditionsPerPage
							)
						}
					>
						Next {conditionsPerPage} Conditions
					</button>
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full border-collapse">
					<thead>
						<tr>
							<th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5"></th>
							<th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
								Patient Id
							</th>
							<th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
								Recorded Date
							</th>
							<th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
								Diagnose
							</th>
							<th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
								Code
							</th>
							{/* <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
								Verification Status
							</th> */}
							<th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
								Clinical Status
							</th>
							<th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
								Note
							</th>
							{/* Add more headers for other condition properties */}
						</tr>
					</thead>
					<tbody>
						{filterAndSortConditions().map(condition => (
							<tr
								key={condition.id}
								onClick={() => handleRowClick(condition.id)}
								className="cursor-pointer hover:bg-gray-100"
							>
								<td className="p-4 font-mono md:font-mono text-lg/2 md:text-lg/2 whitespace-nowrap"></td>
								<td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
									{condition.subject?.identifier?.value}
								</td>
								<td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
									{condition.recordedDate
										? condition.recordedDate
												.toLocaleString()
												.slice(0, -5)
												.replace('T', ' ')
										: ''}
								</td>
								<td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
									{condition.code?.coding?.[0]?.display}
								</td>
								<td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
									{condition.code?.coding?.[0]?.code}
								</td>

								{/* <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
									{condition.verificationStatus?.coding?.[0]?.display}
								</td> */}
								<td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
									{condition.clinicalStatus?.coding?.[0]?.display}
								</td>
								<td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
									{condition.note?.[0]?.text}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ConditionList;
