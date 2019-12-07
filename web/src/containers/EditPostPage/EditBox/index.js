import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { UPDATE_POST } from '../queries';

import {
  EditBoxWrapper,
  StyledTextBox,
  ButtonGroup,
  StyledButton,
} from './styles';

function EditBox({ post }) {
  const [redirect, setRedirect] = useState(false);
  const [text, setText] = useState(post.content);
  const [updatePost, { loading, error, data }] = useMutation(UPDATE_POST);

  const onTextChange = e => setText(e.target.value);
  const editPost = () => {
    updatePost({ variables: { postURL: post.postURL, content: text } });
  };

  const cancelEdit = () => setRedirect(true);

  if (redirect || data) return <Redirect to="/" />;
  return (
    <EditBoxWrapper>
      <StyledTextBox onChange={onTextChange} value={text} />
      <ButtonGroup>
        <StyledButton onClick={editPost} blue>
          수정
        </StyledButton>
        <StyledButton onClick={cancelEdit}>취소</StyledButton>
      </ButtonGroup>
    </EditBoxWrapper>
  );
}

export default EditBox;
