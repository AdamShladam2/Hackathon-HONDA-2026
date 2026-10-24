import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSchoolEmail, KNOWN_SCHOOLS } from './schoolDomain';

test('validates @osu.edu email correctly and matches Ohio State University', () => {
  const result = validateSchoolEmail('vance.42@osu.edu');
  assert.equal(result.isValid, true);
  assert.equal(result.school?.name, 'The Ohio State University');
  assert.equal(result.school?.id, 'osu');
  assert.equal(result.school?.mascot, 'Buckeyes');
});

test('validates other .edu schools like @umich.edu and @stanford.edu', () => {
  const michResult = validateSchoolEmail('student@umich.edu');
  assert.equal(michResult.isValid, true);
  assert.equal(michResult.school?.shortName, 'UMich');

  const stanfordResult = validateSchoolEmail('researcher@stanford.edu');
  assert.equal(stanfordResult.isValid, true);
  assert.equal(stanfordResult.school?.shortName, 'Stanford');
});

test('generates dynamic university record for unlisted .edu school', () => {
  const mitResult = validateSchoolEmail('coder@mit.edu');
  assert.equal(mitResult.isValid, true);
  assert.equal(mitResult.school?.name, 'MIT University');
});

test('rejects non-.edu emails with clear error message', () => {
  const gmailResult = validateSchoolEmail('developer@gmail.com');
  assert.equal(gmailResult.isValid, false);
  assert.match(gmailResult.errorMessage || '', /restricted to accredited college emails ending in \.edu/i);

  const emptyResult = validateSchoolEmail('   ');
  assert.equal(emptyResult.isValid, false);
});
