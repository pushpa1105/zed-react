import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useForm, useStore } from "@tanstack/react-form";
import { CreateWorkspaceFormSchema } from "@/schemas";
import { createWorkspace } from "@/services";
import { withAsyncHandler } from "@/utils/withAsyncHandler";
import type { CreateWorkspaceType } from "@/types";
import { SmartForm } from "@/components/forms/SmartForm";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "@/hooks";

const items = [
    {
        label: 'Personal',
        description: 'For Personal Use',
        value: 'personal'
    },
    {
        label: 'Team',
        description: 'For Team Use',
        value: 'team'
    },
]

const CreateWorkspacePage = () => {
    const navigate = useNavigate()
    const { setActiveWorkspace } = useWorkspace()

    const handleCreateWorkspace = async (data: CreateWorkspaceType) => {
        await withAsyncHandler(
            () => createWorkspace(data),
            {
                onSuccess: (res) => {
                    setActiveWorkspace(res?.data?.data)
                    navigate('/')
                }
            }
        )
    }
    const createWorkspaceFormInstance = useForm({
        defaultValues: {
            name: '',
            type: 'personal',
            teamId: '',
        },
        validators: {
            onSubmit: CreateWorkspaceFormSchema
        },
        onSubmit: ({ value }) => {
            console.log(value)
            handleCreateWorkspace(value)
        },
        formId: 'createWorkspaceForm',
    })

    const selectedType = useStore(createWorkspaceFormInstance.store, (state) => state.values.type)

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-xl">
                <Card className="border-0 shadow-none">
                    <CardHeader>
                        <CardTitle>Create Workspace</CardTitle>
                        <CardDescription>
                            Fill up the details below
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SmartForm
                            formInstance={createWorkspaceFormInstance}
                            inputItems={[
                                {
                                    key: 'type',
                                    type: 'card-radio-group',
                                    items,
                                    label: 'For what use?',
                                    className: 'grid grid-cols-1 md:grid-cols-2'
                                },
                                ...(selectedType === 'team'
                                    ?
                                    [{
                                        key: 'teamId',
                                        label: 'Select Team',
                                    }]
                                    : []
                                ),
                                {
                                    label: 'What do you want your workspace to be called?',
                                    key: 'name',
                                    placeholder: 'Workspace Name'
                                }
                            ]}
                        />
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full" form="createWorkspaceForm">
                            Next
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default CreateWorkspacePage;
