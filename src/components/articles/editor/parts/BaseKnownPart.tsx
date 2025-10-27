import EditableFieldTextArea from "@components/common/fields/EditableFieldTextArea";
import {
	KnownParts,
	type BaseKnownPart,
} from "@lib/articles/editor/knownParts";
interface Props {
	data: BaseKnownPart;
	submitContent: (content: string) => void;
}
const BaseKnownPartComponent = ({ data, submitContent }: Props) => {
	return (
		<EditableFieldTextArea
			inputProps={{}}
			submitCallback={async (value) => {
				submitContent(value);
				return true;
			}}
			value={data.content}
			name={KnownParts[data.type].name}
		></EditableFieldTextArea>
	);
};

export default BaseKnownPartComponent;
