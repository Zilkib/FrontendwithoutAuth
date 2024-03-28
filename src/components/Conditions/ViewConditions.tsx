import React, { useState, useEffect } from 'react';
import { fhirR4 } from '@smile-cdr/fhirts';
import BundleEntry from '../Utils/BundleEntry';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { filterResources, sortResources } from '../Utils/utils';
import Banner from '../elements/Banner';

const ConditionList: React.FC = () => {
	// State variables
	const { getAccessTokenSilently } = useAuth0();
	const [conditions, setConditions] = useState<fhirR4.Condition[]>([]);
	const [searchText, setSearchText] = useState('');
	const [filterAttribute, setFilterAttribute] = useState('patient');
	const [sortAttribute, setSortAttribute] = useState('recordedDate');
	const [conditionsPerPage, setConditionsPerPage] = useState(20);
	const [offsetConditionsPerPage, setOffsetConditionsPerPage] = useState(0);
	const navigate = useNavigate();

	// Fetch conditions when the component mounts
	useEffect(() => {
		fetchConditions();
	}, [conditionsPerPage, offsetConditionsPerPage, getAccessTokenSilently]);

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
		const token = await getAccessTokenSilently();
		try {
			const response = await fetch(
				`http://localhost:8080/fhir/Condition?_count=${conditionsPerPage}&_offset=${offsetConditionsPerPage}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			); // Replace with your API endpoint
			// const data = await response.json();
			const conditions = [
				{
					resourceType: 'Condition',
					id: 'example1',
					clinicalStatus: {
						coding: [
							{
								system:
									'http://terminology.hl7.org/CodeSystem/condition-clinical',
								code: 'active',
								display: 'Active',
							},
						],
					},
					verificationStatus: {
						coding: [
							{
								system:
									'http://terminology.hl7.org/CodeSystem/condition-ver-status',
								code: 'confirmed',
								display: 'Confirmed',
							},
						],
					},
					category: [
						{
							coding: [
								{
									system:
										'http://terminology.hl7.org/CodeSystem/condition-category',
									code: 'problem-list-item',
									display: 'Problem List Item',
								},
							],
						},
					],
					code: {
						coding: [
							{
								system: 'http://snomed.info/sct',
								code: '386661006',
								display: 'Fever',
							},
						],
					},
					subject: {
						reference: 'Patient/example',
					},
				},
				{
					resourceType: 'Condition',
					id: 'example2',
					clinicalStatus: {
						coding: [
							{
								system:
									'http://terminology.hl7.org/CodeSystem/condition-clinical',
								code: 'resolved',
								display: 'Resolved',
							},
						],
					},
					verificationStatus: {
						coding: [
							{
								system:
									'http://terminology.hl7.org/CodeSystem/condition-ver-status',
								code: 'confirmed',
								display: 'Confirmed',
							},
						],
					},
					category: [
						{
							coding: [
								{
									system:
										'http://terminology.hl7.org/CodeSystem/condition-category',
									code: 'encounter-diagnosis',
									display: 'Encounter Diagnosis',
								},
							],
						},
					],
					code: {
						coding: [
							{
								system: 'http://snomed.info/sct',
								code: '195967001',
								display: 'Traumatic injury of head',
							},
						],
					},
					subject: {
						reference: 'Patient/example',
					},
					note: [
						{
							text: 'This is a note',
						},
					],
				},
			];
			// Extract the resource property from the Bundle entry

			// if ('entry' in data) {
			// 	const conditionsData = data.entry.map(
			// 		(entry: BundleEntry) => entry.resource
			// 	);
			// 	// Store the extracted conditions in state
			// 	setConditions(conditionsData);
			// } else {
			// 	//TODO : What should happen if we have reached the limit. Some warning?
			// }
			setConditions(conditions as fhirR4.Condition[]);
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
		const sortedConditions = sortResources(filteredConditions, sortAttribute);
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
						<option value="patient">Search by Patient</option>
						{/* Add options for other attributes */}
					</select>
					<select
						className="rounded border-b-2 mr-2 font-mono md:font-mono text-lg/5 md:text-lg/5 mb-2 md:mb-0"
						value={sortAttribute}
						onChange={handleSortAttributeChange}
					>
						<option value="recordedDate">Sort by Recorded Date</option>
						{/* Add options for             <option value="verificationStatus">Sort by Verification Status</option>
            {/* Add options for other attributes */}
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
							<th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
								Patient Name
							</th>
							<th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
								Patient Identifier
							</th>
							<th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
								Recorded Date
							</th>
							<th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
								Verification Status
							</th>
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
								<td className="p-4 font-mono md:font-mono text-lg/2 md:text-lg/2 whitespace-nowrap">
									{condition.subject?.display}
								</td>
								<td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
									{condition.subject?.identifier?.value}
								</td>
								<td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
									{condition.onsetDateTime}
								</td>
								<td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
									{condition.verificationStatus?.coding?.[0]?.display}
								</td>
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
