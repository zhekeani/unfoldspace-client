import { addResponse } from "@/actions/response/addResponse";
import { updateResponse } from "@/actions/response/updateResponse";
import { useMutation } from "@tanstack/react-query";
import { generateHTML, JSONContent } from "@tiptap/react";
import { useState } from "react";
import { toast } from "sonner";
import ResponseEditor from "../editor/components/ResponseEditor/ResponseEditor";
import { responseEditorExtensions } from "../editor/hooks/userResponseEditor";

type BaseProps = {
  entityId: string;
  responseType: "story" | "list";
  parentId?: string | null;
  initialFocus?: boolean;
  initialContent?: JSONContent;
  onCloseCb?: () => void;
  onSuccessCb?: (
    responseId: string,
    htmlContent: string,
    stringJsonContent: string
  ) => void;
};

type AddResponseProps = BaseProps & {
  actionType?: "add";
  responseId?: undefined;
};

type UpdateResponseProps = BaseProps & {
  actionType?: "update";
  responseId: string;
};

export type ResponseEditorProps = AddResponseProps | UpdateResponseProps;

const ResponseEditorContainer = ({
  entityId,
  responseType,
  responseId,
  parentId,
  initialContent,
  initialFocus,
  onCloseCb,
  onSuccessCb,
  actionType = "add",
}: ResponseEditorProps) => {
  const [isOpen, setIsOpen] = useState(initialFocus || false);
  const [content, setContent] = useState<JSONContent>(
    initialContent || {
      type: "doc",
      content: [],
    }
  );
  const isUpdate = actionType === "update";

  const { mutate: addResponseMutation, isPending: isAddingResponse } =
    useMutation({
      mutationFn: async ({
        htmlContent,
        jsonContent,
      }: {
        htmlContent: string;
        jsonContent: JSONContent;
      }) =>
        actionType === "update"
          ? updateResponse(
              responseType,
              responseId!,
              htmlContent,
              JSON.stringify(jsonContent)
            )
          : addResponse(
              responseType,
              htmlContent,
              JSON.stringify(jsonContent),
              entityId,
              parentId || undefined
            ),

      onSuccess: (response) => {
        if (!response.success) {
          toast.error(response.error);
        } else {
          toast.success(`Response ${isUpdate ? "updated!" : "added!"}`);
          if (onSuccessCb)
            onSuccessCb(
              response.data.responseId,
              response.data.htmlContent,
              response.data.stringJsonContent
            );
          setIsOpen(false);
        }
      },

      onError: () => {
        toast.error(`Failed to ${isUpdate ? "update" : "add"} response.`);
      },
    });

  const onSubmit = () => {
    const htmlContent = generateHTML(content, responseEditorExtensions);
    addResponseMutation({ htmlContent, jsonContent: content });
  };

  return (
    <ResponseEditor
      onCloseCb={() => {
        setContent({ type: "doc", content: [] });
        if (onCloseCb) onCloseCb();
      }}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      content={content}
      setContent={setContent}
      isEditable
      onSubmit={onSubmit}
      isSubmitting={isAddingResponse}
    />
  );
};

export default ResponseEditorContainer;
