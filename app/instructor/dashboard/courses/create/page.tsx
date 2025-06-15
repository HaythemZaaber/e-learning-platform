import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseBuilder } from "@/features/instructor/components/Course-builder"
import { CoursePreview } from "@/features/instructor/components/Course-preview"
import { CourseSettings } from "@/features/instructor/components/Course-settings"



const CreateCoursePage = () => {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Create a New Course</h1>
          <p className="text-muted-foreground">Craft and publish your course.</p>
        </div>
        <Button>Publish</Button>
      </div>

      <Tabs defaultValue="builder" className="mt-6">
        <TabsList>
          <TabsTrigger value="builder">Course Builder</TabsTrigger>
          <TabsTrigger value="settings">Course Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="builder" className="mt-4">
          <CourseBuilder />
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <CourseSettings />
        </TabsContent>
        <TabsContent value="preview" className="mt-4">
          <CoursePreview />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CreateCoursePage
