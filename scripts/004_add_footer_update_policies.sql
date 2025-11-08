-- Add INSERT and UPDATE policies for cms_footer table
-- This allows authenticated users to modify footer configuration

-- Enable INSERT for authenticated users
CREATE POLICY "Enable insert for authenticated users" ON cms_footer 
FOR INSERT 
WITH CHECK (true);

-- Enable UPDATE for authenticated users
CREATE POLICY "Enable update for authenticated users" ON cms_footer 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Enable DELETE for authenticated users
CREATE POLICY "Enable delete for authenticated users" ON cms_footer 
FOR DELETE 
USING (true);
