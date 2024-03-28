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
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void => {
		const { name, value } = e.target;
		setEditedCondition(prevCondition => ({
			...prevCondition,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		onSave(e, editedCondition);
	};

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Edit Condition</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label htmlFor="patientName" className="text-lg font-medium">
						Patient Name:
					</label>
					<input
						type="text"
						id="patientName"
						name="patientName"
						value={editedCondition.subject?.display || ''}
						onChange={handleInputChange}
						className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="patientIdentifier" className="text-lg font-medium">
						Patient Identifier:
					</label>
					<input
						type="text"
						id="patientIdentifier"
						name="patientIdentifier"
						value={editedCondition.subject?.identifier?.value || ''}
						onChange={handleInputChange}
						className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="recordedDate" className="text-lg font-medium">
						Recorded Date:
					</label>
					<input
						type="date"
						id="recordedDate"
						name="recordedDate"
						value={editedCondition.onsetDateTime || ''}
						onChange={handleInputChange}
						className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="verificationStatus" className="text-lg font-medium">
						Verification Status:
					</label>
					<input
						type="text"
						id="verificationStatus"
						name="verificationStatus"
						value={editedCondition.verificationStatus?.text || ''}
						onChange={handleInputChange}
						className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="clinicalStatus" className="text-lg font-medium">
						Clinical Status:
					</label>
					<input
						type="text"
						id="clinicalStatus"
						name="clinicalStatus"
						value={editedCondition.clinicalStatus?.text || ''}
						onChange={handleInputChange}
						className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="note" className="text-lg font-medium">
						Note:
					</label>
					<textarea
						id="note"
						name="note"
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
