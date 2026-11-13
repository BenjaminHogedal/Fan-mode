'use client';
import ActivationAnimation from './ActivationAnimation';
import PostMatchAnimation from './PostMatchAnimation';

export function ActivationProgress() {
  return <ActivationAnimation stage="progress"/>;
}
export function ActivationSuccess() {
  return <ActivationAnimation stage="success"/>;
}
export function FullTime() {
  return <PostMatchAnimation stage="fulltime"/>;
}
export function CollectingEntries() {
  return <PostMatchAnimation stage="collecting"/>;
}
