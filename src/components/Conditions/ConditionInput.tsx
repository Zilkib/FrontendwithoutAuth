import React, { useState } from 'react';
import { fhirR4 } from '@smile-cdr/fhirts';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SubmissionStatus from '../elements/SubmissonStatus';
import Banner from '../elements/Banner';
import { post } from '../Utils/utils';
import { FormField } from '../Utils/formComponents';

const ConditionInput: React.FC = () => {
	// State variables
	const token = '';
	const { patientId } = useParams<{ patientId: string }>();
	const [submissionStatus, setSubmissionStatus] = useState<
		'success' | 'failure' | null
	>(null);
	const [conditionData, setConditionData] = useState<fhirR4.Condition>({
		resourceType: 'Condition',
		identifier: [{ system: '', value: '' }],
		category: [{ coding: [{ system: '', code: '', display: '' }], text: '' }],
		clinicalStatus: {
			coding: [{ system: '', code: '', display: '' }],
			text: '',
		},
		verificationStatus: {
			coding: [{ system: '', code: '', display: '' }],
			text: '',
		},
		code: { coding: [{ system: '', code: '', display: '' }], text: '' },
		subject: { reference: '', type: '' },
		onsetDateTime: '',
		abatementDateTime: '',
		recorder: { reference: '', type: '' },
		note: [{ authorString: '', text: '' }],
	});

	/**
	 * Handles the submission of the form.
	 *
	 * This function gathers the data from the form, constructs Condition instance according to the FHIR R4 specification,
	 * and sends it to a FHIR server.
	 *
	 * If the API request succeeds, the submission status is updated to 'success'; if it fails, it's updated to 'failure'.
	 *
	 * @param {React.FormEvent<HTMLFormElement>} e - The event object from the form submission event.
	 */
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Extract the values from the form and prepare them for the FHIR object.
		const formData = new FormData(e.currentTarget);
		const identifierSystem = formData.get('identifierSystem') as string;
		const identifierValue = formData.get('identifierValue') as string;
		const categorySystem = formData.get('categorySystem') as string;
		const categoryCode = formData.get('categoryCode') as string;
		const categoryDisplay = formData.get('categoryDisplay') as string;
		const clinicalStatusSystem = formData.get('clinicalStatusSystem') as string;
		const clinicalStatusCode = formData.get('clinicalStatusCode') as string;
		const clinicalStatusDisplay = formData.get(
			'clinicalStatusDisplay'
		) as string;
		const verificationStatusSystem = formData.get(
			'verificationStatusSystem'
		) as string;
		const verificationStatusCode = formData.get(
			'verificationStatusCode'
		) as string;
		const verificationStatusDisplay = formData.get(
			'verificationStatusDisplay'
		) as string;
		const codeSystem = formData.get('codeSystem') as string;
		const codeCode = formData.get('codeCode') as string;
		const codeDisplay = formData.get('codeDisplay') as string;
		const subjectReference = formData.get('subjectReference') as string;
		const subjectType = formData.get('subjectType') as string;
		const onsetDateTime = formData.get('onsetDateTime') as string;
		const assertedDate = formData.get('assertedDate') as string;
		const recorderReference = formData.get('recorderReference') as string;
		const recorderType = formData.get('recorderType') as string;
		const noteAuthorString = formData.get('noteAuthorString') as string;
		const noteText = formData.get('noteText') as string;

		// Constructing Condition object
		const condition: fhirR4.Condition = {
			identifier: [{ system: identifierSystem, value: identifierValue }],
			category: [
				{
					coding: [
						{
							system: categorySystem,
							code: categoryCode,
							display: categoryDisplay,
						},
					],
					text: '',
				},
			],
			
			code: {
				coding: [{ system: codeSystem, code: codeCode, display: codeDisplay }],
				text: '',
			},
			subject: { reference: subjectReference, type: subjectType },
			onsetDateTime: onsetDateTime,
			abatementDateTime: assertedDate,
			recorder: { reference: recorderReference, type: recorderType },
			note: [{ authorString: noteAuthorString, text: noteText }],
			resourceType: 'Condition',
		};

		// Send the Condition data to the server
		try {
			await post('Condition', condition, token, setSubmissionStatus);
			setSubmissionStatus('success');
		} catch (error) {
			setSubmissionStatus('failure');
		}
	};

	return (
		<div>
			<Banner>Enter new Condition</Banner>
			<div className="max-w-7xl mx-auto">
				<form
					className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"
					onSubmit={handleSubmit}
				>
					<FormField label="Patient(Identifier)" name="identifierSystem" type="text"/>
					<FormField label="Code" name="code" type="text" />
					<FormField label="Diagnose" name="diagnose" type="text" />
					<div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
					<label>
						Issue Date:
						<input
						className="rounded border-b-2"
						type="datetime-local"
						name="issueDate"
						required
						defaultValue={new Date().toISOString()}
						/>
					</label>
					<br />
					</div>
					<FormField label="Note" name="note" type="text" />
					<FormField label="Active" name="active" type="checkbox" />
					
					<div className="justify-center flex-2">
              		<button
               			 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded object-center text-lg "type="submit">
                			Submit
              		</button>
            		</div>

					<SubmissionStatus
						submissionStatus={submissionStatus}
						submissionTextSuccess={
							'Condition was successfully added to the Database.'
						}
						submissionHeadlineSuccess={'Submission successful!'}
						submissionHeadlineFailure={'Submission failed. Please try again.'}
						submissionTextFailure={
							'Condition could not be successfully added to the Database.'
						}
					/>
				</form>
			</div>
		</div>
	);
};

export default ConditionInput;
