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

		clinicalStatus: {
			// coding: [{ system: '', code: '', display: '' }],
			text: '',
		},
		verificationStatus: {
			// coding: [{ system: '', code: '', display: '' }],
			text: '',
		},
		code: {
			// coding: [{ system: '', code: '', display: '' }],
			text: '',
		},
		subject: { reference: '', type: '' },
		onsetDateTime: '',
		abatementDateTime: '',
		// recorder: { reference: '', type: '' },
		note: [
			{
				// authorString: '',
				text: '',
			},
		],
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

		//const clinicalStatusDisplay = formData.get('diagnose') as string;
		const newclinicalStatus = new fhirR4.CodeableConcept();
    		newclinicalStatus.coding = [
      {
        system: "http://hl7.org/fhir/ValueSet/condition-clinical",
        code:
          (
            e.currentTarget.elements.namedItem(
              "clinicalStatus"
            ) as HTMLSelectElement
          ).value ?? "",
        display:
          (
            e.currentTarget.elements.namedItem(
              "clinicalStatus"
            ) as HTMLSelectElement
          ).selectedOptions[0].textContent ?? "",
      },
    ];

		const newIdentifier = new fhirR4.Identifier();
		const recorderReference = formData.get('recorderReference') as string;
		const recorderType = formData.get('recorderType') as string;
		const noteAuthorString = formData.get('noteAuthorString') as string;
		const identifierSystem = formData.get('identifierSystem') as string;
		const codeDisplay = formData.get('code') as string;
		const diagnoseString = formData.get("diagnose") as string;

		const DateTimeValue = formData.get("issueDate") as string;
		const issueDate = new Date(DateTimeValue).toISOString();
		const noteText = formData.get('note') as string;

		// Constructing Condition object
		const condition: fhirR4.Condition = {
			identifier: [newIdentifier],
			clinicalStatus: newclinicalStatus,
			verificationStatus: {
				coding: [
					{
						system: 'http://snomed.info/sct',
						code: '609096000',
						display: '',
					},
				],
				text: '',
			},

			category: [
				{
					coding: [
						{
							system: 'http://snomed.info/sct',
							code: '408646000',
							display: 'Clinical finding',
						},
					],
					text: '',
				},
			],

			severity: {
				coding: [
					{
						system: 'http://snomed.info/sct',
						code: '408646000',
						display: 'Clinical finding',
					},
				],
				text: '',
			},

			code: {
				coding: [
					{ 
						system: 'http://snomed.info/sct', 
						code: codeDisplay, 
						display: diagnoseString 
					},
				],
				text: '',
			},
			bodySite: [
				{
					coding: [
						{
							system: 'http://snomed.info/sct',
							code: '408646000',
							display: 'Clinical finding',
						},
					],
					text: '',
				},
			],

			subject: {
				reference: '',
				type: 'Patient',
				identifier: { system: '', value: identifierSystem },
			},
			encounter: { reference: '', type: '' },
			onsetDateTime: '',
			onsetAge: { value: 0, unit: '' },
			onsetPeriod: { start: '', end: '' },
			onsetRange: { low: { value: 0, unit: '' }, high: { value: 0, unit: '' } },
			onsetString: '',
			abatementDateTime: '',
			abatementAge: { value: 0, unit: '' },
			abatementPeriod: { start: '', end: '' },
			abatementRange: {
				low: { value: 0, unit: '' },
				high: { value: 0, unit: '' },
			},
			abatementString: '',
			recordedDate: issueDate,
			stage: [
				{
					summary: { coding: [], text: '' },
					assessment: [],
					type: { coding: [], text: '' },
				},
			],
			evidence: [],
			recorder: { reference: recorderReference, type: recorderType },
			note: [{ authorString: noteAuthorString, text: noteText }],
			resourceType: 'Condition',
		};

		console.log(condition);

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
					<FormField
						label="Patient(Identifier)"
						name="identifierSystem"
						type="text"
					/>
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
					<FormField
					label="Clinical Status"
					name="clinicalStatus"
					type="select"
					options={[
						{ label: "Active", value: "active" },
						{ label: "Recurrence", value: "resurrence" },
						{ label: "Relapse", value: "relapse" },
						{ label: "Inactive", value: "Inactive" },
						{ label: "Remission", value: "remission" },
						{ label: "Resolved", value: "resolved" },
						{ label: "Unknown", value: "unknown" },
					]}
					/>

					<div className="justify-center flex-2">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded object-center text-lg "
							type="submit"
						>
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
