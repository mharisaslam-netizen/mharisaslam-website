import { withWorkflow } from "workflow/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false
};

export default withWorkflow(nextConfig);
