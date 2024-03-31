import React, { ChangeEvent, FormEvent, useState } from 'react';
import { fhirR4 } from '@smile-cdr/fhirts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

interface EditConditionFormProps {
	condition: fhirR4.Condition;
	onSave: (
		event: FormEvent,
		editedCondition: fhirR4.Condition
	) => Promise<void>;
	onCancel: () => void;
}

const EditConditionForm: React.FC<EditConditionFormProps> = ({
	condition,
	onSave,
	onCancel,
}) => {
	const [editedCondition, setEditedCondition] =
		useState<fhirR4.Condition>(condition);

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement |HTMLSelectElement>
	): void => {
		let { name, value } = e.target;

		// Create a copy of the editedCondition state
		let updatedCondition: fhirR4.Condition = { ...editedCondition };

		// Check if the name is onsetDateTime
		if (name === 'onsetDateTime') {
			// Convert the date string to a Date object
			value = value + ':00+00:00';
			// Update the state with the modified onsetDateTime
			setEditedCondition({ ...updatedCondition, onsetDateTime: value });
			return;
		}

		// Split the name attribute by '.' to handle nested properties
		const nameParts: string[] = name.split('.');

		// Traverse the nested structure and update the value
		let currentLevel: any = updatedCondition;
		for (let i = 0; i < nameParts.length - 1; i++) {
			if (!currentLevel[nameParts[i]]) {
				// If the nested property doesn't exist, create it as an empty object or array
				currentLevel[nameParts[i]] = {};
			}
			// Move to the next level
			currentLevel = currentLevel[nameParts[i]];
		}

		// Update the final nested property with the new value
		const finalName = nameParts[nameParts.length - 1];
		if (Array.isArray(currentLevel[finalName])) {
			// If it's an array, assume it's an array of objects and handle it accordingly
			currentLevel[finalName][0].text = value;
		} else {
			// If it's not an array, just set the value directly
			currentLevel[finalName] = value;
		}

		// Update the state with the modified condition
		setEditedCondition(updatedCondition);
	};

	const formattedDateTime = editedCondition.recordedDate
		? editedCondition.recordedDate.toString().slice(0, 16) // Extract the first 16 characters (YYYY-MM-DDTHH:MM)
		: '';

	const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		onSave(e, editedCondition);
	};

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Edit Condition</h2>
			<form onSubmit={handleSubmit}>
				
				<div className="mb-4">
					<label htmlFor="patientIdentifier" className="text-lg font-medium">
						Patient Identifier:
					</label>
					<input
						type="text"
						id="patientIdentifier"
						name="subject.identifier.value"
						value={editedCondition.subject?.identifier?.value || ''}
						onChange={handleInputChange}
						className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="diagnose" className="text-lg font-medium">
						Diagnose:
					</label>
					<input
						type="text"
						id="diagnose"
						name="diagnose.text"
						value={editedCondition.code?.coding?.[0]?.display || ''}
						onChange={handleInputChange}
						className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="code" className="text-lg font-medium">
						Code:
					</label>
					<input
						type="text"
						id="code"
						name="code.value"
						value={editedCondition.code?.coding?.[0]?.code || ''}
						onChange={handleInputChange}
						className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>

				<div className="mb-4">
					<label htmlFor="clinicalStatus" className="text-lg font-medium">
						Clinical Status:
					</label>
					{/* <input
						type="text"
						id="clinicalStatus"
						name="clinicalStatus.text"
						value={editedCondition.clinicalStatus?.text || ''}
						onChange={handleInputChange}
						className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/> */}
					<select
						name="clinicalStatus.coding.0.display"
						className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
						value={editedCondition.clinicalStatus?.coding?.[0]?.display || ''}
						onChange={handleInputChange}
					>
						<option value="active">Active</option>
						<option value="recurrence">Recurrence</option>
						<option value="relapse">Relapse</option>
						<option value="inactive">Inactive</option>
						<option value="remission">Remission</option>
						<option value="resolved">Resolved</option>
						<option value="unknown">Unknown</option>
					</select>
				</div>

				<div className="mb-4">
					<label htmlFor="note" className="text-lg font-medium">
						Note:
					</label>
					<textarea
						id="note"
						name="note.0.text"
						value={editedCondition.note?.[0]?.text || ''}
						onChange={handleInputChange}
						className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>

				<div className="flex justify-center mt-6">
					<button
						type="submit"
						className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
					>
						<FontAwesomeIcon icon={faSave} className="mr-2" />
						Save
					</button>
					<button
						type="button"
						className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
						onClick={onCancel}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditConditionForm;
