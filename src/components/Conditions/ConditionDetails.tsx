import React, { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { fhirR4 } from '@smile-cdr/fhirts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
//import { useAuth0 } from '@auth0/auth0-react';
import SubmissionStatus from '../elements/SubmissonStatus';
import Banner from '../elements/Banner';
import EditConditionForm from './EditConditionForm';

const ConditionDetails = () => {
	const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
	const { conditionId } = useParams();
	const [condition, setCondition] = useState<fhirR4.Condition | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [editedCondition, setEditedCondition] = useState<fhirR4.Condition>(
		{} as fhirR4.Condition
	);
	//const { getAccessTokenSilently } = useAuth0();
	const token="";
	const navigate = useNavigate();

	useEffect(() => {
		fetchCondition();
	}, [conditionId, token]);

	const fetchCondition = async () => {
		const token ="" /*await getAccessTokenSilently()*/;
		try {
			const response = await fetch(
				`http://localhost:8080/fhir/Condition/${conditionId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await response.json();
			setCondition(data);
		} catch (error) {
			console.error('Error fetching condition:', error);
		}
	};

	const handleEdit = () => {
		setIsEditMode(true);
		if (condition) {
			setEditedCondition(condition);
		}
	};

	const handleCancelEdit = () => {
		setIsEditMode(false);
	};

	const handleSave = async (
		event: FormEvent,
		editedCondition: fhirR4.Condition
	) => {
		event.preventDefault();
		const token = "" /*await getAccessTokenSilently()*/;
		try {
			const response = await fetch(
				`http://localhost:8080/fhir/Condition/${conditionId}`,
				{
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(editedCondition),
				}
			);
			if (response.ok) {
				setCondition(editedCondition);
				setIsEditMode(false);
			} else {
				console.error('Failed to save condition data');
			}
		} catch (error) {
			console.error('Error saving condition data:', error);
		}
	};

	const handleDelete = async () => {
		const token = "" /*await getAccessTokenSilently()*/;
		try {
			const response = await fetch(
				`http://localhost:8080/fhir/Condition/${conditionId}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.ok) {
				navigate(`/condition`);
			} else {
				setSubmissionStatus('failure');
				console.error('Failed to delete condition');
			}
		} catch (error) {
			setSubmissionStatus('failure');
			console.error('Error deleting condition:', error);
		}
	};

	const renderConditionDetails = () => {
		if (!condition) {
			return <p className="text-gray-500 text-lg">Loading...</p>;
		}
		if (isEditMode) {
			return (
				<EditConditionForm
					condition={condition}
					onSave={handleSave}
					onCancel={handleCancelEdit}
				/>
			);
		}

		return (
			<section className="flex flex-col items-center justify-center py-12 bg-gray-50">
				<article className="max-w-lg w-full bg-white shadow-md rounded-lg overflow-hidden">
					<header className="px-6 py-4">
						<h2 className="text-xl font-bold mb-2">Condition Details</h2>
					</header>
					<div className="grid grid-cols-2 gap-4 px-6 py-4">
						
						<div>
							<p className="text-lg font-medium">Patient Identifier:</p>
							<p className="text-gray-600">
								{condition.subject?.reference?.slice(8)}
							</p>
						</div>
						<div>
							<p className="text-lg font-medium">Diagnose:</p>
							<p className="text-gray-600">
								{condition.code?.coding?.[0]?.display}
							</p>
						</div>
						<div>
							<p className="text-lg font-medium">Code:</p>
							<p className="text-gray-600">
								{condition.code?.coding?.[0]?.code}
							</p>
						</div>
						

						<div>
							<p className="text-lg font-medium">Clinical Status:</p>
							<p className="text-gray-600">
								{condition.clinicalStatus?.coding?.[0]?.display}
							</p>
						</div>
						<div>
							<p className="text-lg font-medium">Note:</p>
							<p className="text-gray-600">{condition.note?.[0]?.text}</p>
						</div>
					</div>
					<footer className="flex justify-evenly mt-4 p-4 bg-gray-50 border-t">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							onClick={handleEdit}
						>
							<FontAwesomeIcon icon={faEdit} className="mr-2" />
							Edit
						</button>
						<button
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							onClick={handleDelete}
						>
							<FontAwesomeIcon icon={faTrash} className="mr-2" />
							Delete
						</button>
						<SubmissionStatus
							submissionStatus={submissionStatus}
							submissionTextSuccess="Condition was successfully deleted from the Database."
							submissionHeadlineSuccess="Delete Successful!"
							submissionHeadlineFailure="Delete Failed"
							submissionTextFailure="Condition could not be successfully deleted from the Database. Please check if all related data are deleted."
						/>
					</footer>
				</article>
			</section>
		);
	};

	return (
		<section>
			<Banner>{condition?.code?.coding?.[0]?.display}</Banner>
			<main className="flex items-center justify-center min-h-screen bg-gray-50">
				{renderConditionDetails()}
			</main>
		</section>
	);
};

export default ConditionDetails;
