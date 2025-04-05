
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Wrench } from 'lucide-react';

interface ToolPanelProps {
  title: string;
  description: string;
  children: React.ReactNode;
  documentation?: React.ReactNode;
}

const ToolPanel: React.FC<ToolPanelProps> = ({
  title,
  description,
  children,
  documentation
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="tool" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tool" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Tool
          </TabsTrigger>
          <TabsTrigger value="docs" disabled={!documentation} className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Documentation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tool">
          <CardContent>
            {children}
          </CardContent>
        </TabsContent>
        
        {documentation && (
          <TabsContent value="docs">
            <CardContent className="prose prose-invert max-w-none">
              {documentation}
            </CardContent>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
};

export default ToolPanel;
