'use server'

import { mockTreeData } from '../../data/mockTree';

export async function getFileData() {
  // Load mock data
  // console.log('Mock data loading', mockTreeData)
  return mockTreeData
}
