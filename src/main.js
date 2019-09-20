const core = require('@actions/core');
const { GitHub } = require('@actions/github');
const fs = require('fs');

async function run() {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = new GitHub(process.env.GITHUB_TOKEN);

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const upload_url = core.getInput('upload_url', { required : true });
    const asset_path = core.getInput('asset_path', { required : true });
    const asset_name = core.getInput('asset_name', { required : true });
    const asset_content_type = core.getInput('asset_content_type', { required : true });

    // Determine content-length for header to upload asset
    const content_length = (asset_path) => { return fs.statSync(asset_path).size; };

    // Setup headers for API call, see Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset for more information
    const headers = { 'content-type': asset_content_type, 'content-length': content_length(asset_path) };

    // Upload a release asset
    // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset
    const uploadAssetResponse = await github.repos.uploadReleaseAsset({
      url: upload_url,
      headers,
      name: asset_name,
      file: asset_path
    });

    // Get the browser_download_url for the uploaded release asset from the response
    const { data: { browser_download_url } } = uploadAssetResponse;

    // Set the output variable for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    core.setOutput('browser_download_url', browser_download_url);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
