'use server'

import { mockTreeData } from '../../data/mockTree';

export async function getTreeData() {
  // Load mock data
  // console.log('Mock data loading', mockTreeData)
  return mockTreeData
}
