jest.mock('@actions/github');

const { GitHub, context } = require('@actions/github');
const run = require('../src/main.js');

/* eslint-disable no-undef */
describe('module', () => {
  let uploadReleaseAsset;

  beforeEach(() => {
    uploadReleaseAsset = jest.fn();

    context.repo = {
      owner: 'owner',
      repo: 'repo'
    };

    const github = {
      repos: {
        uploadReleaseAsset
      }
    };

    GitHub.mockImplementation(() => github);
  });

  test('Upload release endpoint is called', async () => {
    await run();

    expect(uploadReleaseAsset).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo'
    });
  });

  test('Outputs are set', async () => {});
});
