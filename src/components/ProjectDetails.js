import React from 'react';
import PropTypes from 'prop-types';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import { default as Textarea } from '@codeday/topo/Atom/Input/Textarea';
import EditableTextField from './EditableTextField';
import ProjectMembers from './ProjectMembers';
import {
  ProjectEditName,
  ProjectEditType,
  ProjectEditDescription,
  ProjectEditPriorExperience,
  ProjectEditChallengesEncountered,
  ProjectEditCodeLink,
  ProjectEditViewLink,
} from './ProjectDetails.gql';
import ProjectGallery from './ProjectGallery';
import ProjectAwards from './ProjectAwards';
import { MEDIA_TOPICS } from '../util/mediaTopics';
import Image from '@codeday/topo/Atom/Image';
import ProjectFeature from './ProjectFeature';
import ProjectDelete from './ProjectDelete';
import ProjectSubmit from './ProjectSubmit';

const TOPIC_PREFERENCES = [ MEDIA_TOPICS.TEAM, MEDIA_TOPICS.DEMO, MEDIA_TOPICS.PRESENTATION ];

function makeProperLink(link) {
  if (!link) return null;
  return link.startsWith('http') ? link : `http://${link}`;
}

export default function ProjectDetails({ project, editToken, user, availableAwards, showMemberCount, ...props }) {
  const isAdmin = user?.admin;

  const preferredMedia = (project.media || [])
    .map((e, i) => ({ ...e, index: i }))
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'VIDEO' ? 1 : -1;
      if (a.topic !== b.topic) return TOPIC_PREFERENCES.indexOf(a.topic) > TOPIC_PREFERENCES.indexOf(b.topic) ? 1 : -1;
      return a.index > b.index ? -1 : 1;
    })[0] || null;

  return (
    <Box {...props}>
      {preferredMedia && (
        <Image mb={4} src={preferredMedia.coverImage} alt="" />
      )}
      <EditableTextField
        as="h1"
        fontSize="5xl"
        fontWeight="bold"
        component={Input}
        name="name"
        params={{ projectId: project.id }}
        initialValue={project.name}
        gql={ProjectEditName}
        token={editToken}
        cursor={editToken && 'pointer'}
        componentProps={{ d: 'inline-block', width: 'md', fontSize: '3xl' }}
        lineHeight={1}
      />
      {project.eventGroup && (
        <Link
          color="current.textLight"
          fontSize="lg"
          fontWeight="bold"
          textDecoration="none"
          mb={0}
          href={`/projects/${project.eventGroup.id}`}

        >
          {project.eventGroup.title}
        </Link>
      )}

      <Grid templateColumns={{ base: '1fr', lg: '3fr minmax(0, 1fr)' }} gap={8} mt={8}>

        {/* Main Column */}
        <Box>
          {(project.description || editToken) && (
            <>
              <EditableTextField
                component={Textarea}
                name="description"
                params={{ projectId: project.id }}
                initialValue={project.description}
                gql={ProjectEditDescription}
                token={editToken}
                cursor={editToken && 'pointer'}
                componentProps={{ height: 48 }}
              />
            </>
          )}

          {(project.priorExperience || editToken) && (
            <>
              <Heading as="h3" fontSize="lg" mt={8}>
                How much experience do you have? Does the project use anything you didn't create?
              </Heading>
              <EditableTextField
                component={Textarea}
                name="priorExperience"
                params={{ projectId: project.id }}
                initialValue={project.priorExperience}
                gql={ProjectEditPriorExperience}
                token={editToken}
                cursor={editToken && 'pointer'}
                componentProps={{ height: 48 }}
              />
            </>
          )}

          {(project.challengesEncountered || editToken) && (
            <>
              <Heading as="h3" fontSize="lg" mt={8}>What challenges did you encounter?</Heading>
              <EditableTextField
                component={Textarea}
                name="challengesEncountered"
                params={{ projectId: project.id }}
                initialValue={project.challengesEncountered}
                gql={ProjectEditChallengesEncountered}
                token={editToken}
                cursor={editToken && 'pointer'}
                componentProps={{ height: 48 }}
              />
            </>
          )}

          {(project.media?.length > 0 || editToken) && (
            <>
              <Heading as="h3" fontSize="2xl" mt={8}>Media</Heading>
              <ProjectGallery media={project.media} projectId={project.id} editToken={editToken} isAdmin={isAdmin} />
            </>
          )}
        </Box>

        {/* Meta Column */}
        <Box>
          <Box mb={8}>
            <ProjectFeature
              projectId={project.id}
              featured={project.featured}
              editToken={editToken}
              isAdmin={isAdmin}
              d="inline-block"
              m={2}
            />
            <ProjectDelete
              projectId={project.id}
              editToken={editToken}
              isAdmin={isAdmin}
              d="inline-block"
              m={2}
            />

            {(isAdmin || project.awards.length > 0) && (
              <>
                <Heading as="h3" fontSize="xl" mb={2}>Awards</Heading>
                <ProjectAwards
                  projectId={project.id}
                  awards={project.awards}
                  editToken={editToken}
                  availableAwards={availableAwards}
                  isAdmin={isAdmin}
                  mb={8}
                />
              </>
            )}

            <Heading as="h3" fontSize="xl">Links</Heading>
            {(project.viewLink || editToken) && (
              <Box>
                {editToken && <Text d="inline-block" mb={0} mr={1} bold>View: </Text>}
                <EditableTextField
                  component={Input}
                  viewComponent={editToken ? Box : Link}
                  name="viewLink"
                  params={{ projectId: project.id }}
                  initialValue={editToken ? project.viewLink : 'View/Download'}
                  gql={ProjectEditViewLink}
                  token={editToken}
                  cursor="pointer"
                  d="inline-block"
                  href={makeProperLink(project.viewLink)}
                  target="_blank"
                />
              </Box>
            )}

            {(project.codeLink || editToken) && (
              <Box>
                {editToken && <Text d="inline-block" mb={0} mr={1} bold>Code: </Text>}
                <EditableTextField
                  component={Input}
                  viewComponent={editToken ? Box : Link}
                  name="codeLink"
                  params={{ projectId: project.id }}
                  initialValue={editToken ? project.codeLink : 'Code'}
                  gql={ProjectEditCodeLink}
                  token={editToken}
                  cursor="pointer"
                  d="inline-block"
                  href={makeProperLink(project.codeLink)}
                  target="_blank"
                />
              </Box>
            )}

            <Box>
              <Link href={`/project/${project.id}`} mb={0} mr={1}>Showcase Permalink</Link>
            </Box>
          </Box>

          {typeof project.members !== 'undefined' && (
            (showMemberCount)?
            <Heading as="h3" fontSize="xl" mb={2}>Member Count: {project.members.length}</Heading>
              :
              <>
                <Heading as="h3" fontSize="xl" mb={2}>Members</Heading>
                <ProjectMembers projectId={project.id} members={project.members} editToken={editToken} />
              </>
          )}

          <ProjectSubmit mt={6} editToken={editToken} project={project} />

          {project.type === 'HARDWARE' && (
            <Box mt={8}>
              <Heading as="h3" fontSize="sm" color="gray.600" fontWeight={400} mb={2}>
                Hardware category supported by
              </Heading>
              <Box as="a" href="https://www.digikey.com/" target="_blank" rel="noopener" d="inline">
                <Image src="/digikey.png" alt="DigiKey" />
              </Box>
            </Box>
          )}
        </Box>
      </Grid>
    </Box>
  );
}
ProjectDetails.propTypes = {
  project: PropTypes.object.isRequired,
  editToken: PropTypes.string,
  showMemberCount: PropTypes.bool,
};
ProjectDetails.defaultProps = {
  editToken: null,
  showMemberCount: false,
};
