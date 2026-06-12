import { useState } from 'react'
import type { OutputData } from '@editorjs/editorjs'
import DefaultEditor from '@/components/editor/DefaultEditor'

export default function TestPage() {
    const [data, setData] = useState<OutputData | undefined>()

    return (
        <div className="max-w-3xl mx-auto">
            <DefaultEditor
                initialData={data}
                onChange={(content) => setData(content)}
            />

            <pre className="mt-6 bg-gray-100 p-4 rounded">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    )
}
